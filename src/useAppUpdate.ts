import { useCallback, useEffect, useRef, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function useAppUpdate() {
  const registration = useRef<ServiceWorkerRegistration | undefined>(undefined);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState('');
  const { needRefresh: [needRefresh], offlineReady: [offlineReady], updateServiceWorker } = useRegisterSW({
    onRegisteredSW(_url, value) { registration.current = value; },
    onRegisterError() { setMessage('Не удалось проверить обновление. Проверьте интернет и попробуйте позже.'); },
  });
  const check = useCallback(async (manual = false) => {
    if (!('serviceWorker' in navigator)) { if (manual) setMessage('Обновление доступно после публикации по HTTPS.'); return; }
    if (manual) { setChecking(true); setMessage('Проверяем обновление…'); }
    try {
      const value = registration.current || await navigator.serviceWorker.getRegistration(import.meta.env.BASE_URL);
      if (!value) { if (manual) setMessage('Приложение ещё готовится к офлайн-работе. Повторите проверку позже.'); return; }
      await value.update();
      if (manual) setMessage(value.waiting || value.installing
        ? 'Обновление загружается или готово. Закройте настройки и нажмите «Обновить», когда появится предложение.'
        : 'Проверка завершена. Если найдётся новая версия, появится предложение обновиться.');
    } catch { if (manual) setMessage('Нет связи с сервером. Ваши записи остаются на устройстве. Попробуйте позже.'); }
    finally { if (manual) setChecking(false); }
  }, []);
  useEffect(() => {
    const checkOnFocus = () => { void check(); };
    window.addEventListener('focus', checkOnFocus);
    const timer = window.setInterval(checkOnFocus, 60 * 60 * 1000);
    return () => { window.removeEventListener('focus', checkOnFocus); window.clearInterval(timer); };
  }, [check]);
  return { needRefresh, offlineReady, updateServiceWorker, checking, message, check };
}
