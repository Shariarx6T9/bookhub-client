import { useRef, useCallback } from 'react';

export const useApiProtection = () => {
  const controllers = useRef(new Map());

  const protectedRequest = useCallback(async (requestFn, id) => {
    if (controllers.current.has(id)) return null;

    const controller = new AbortController();
    controllers.current.set(id, controller);

    try {
      return await requestFn(controller.signal);
    } catch (error) {
      return error.name === 'AbortError' ? null : null;
    } finally {
      controllers.current.delete(id);
    }
  }, []);

  const cancelAll = useCallback(() => {
    controllers.current.forEach(c => c.abort());
    controllers.current.clear();
  }, []);

  return { protectedRequest, cancelAll };
};