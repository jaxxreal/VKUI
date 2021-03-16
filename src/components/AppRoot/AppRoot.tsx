import { FC, HTMLAttributes, useRef, useState } from 'react';
import { useDOM } from '../../lib/dom';
import { classNames } from '../../lib/classNames';
import { AppRootContext } from './AppRootContext';
import { withAdaptivity, SizeType, AdaptivityProps } from '../../hoc/withAdaptivity';
import { useIsomorphicLayoutEffect } from '../../lib/useIsomorphicLayoutEffect';
import { classScopingMode } from '../../lib/classScopingMode';
import { IconSettingsProvider } from '@vkontakte/icons';
import { noop } from '../../lib/utils';

// Используйте classList, но будьте осторожны
/* eslint-disable no-restricted-properties */

export interface AppRootProps extends HTMLAttributes<HTMLDivElement>, AdaptivityProps {
  embedded?: boolean;
  partial?: boolean;
  window?: Window;
  /** Убирает классы без префикса (.Button) */
  noLegacyClasses?: boolean;
}

const AppRoot: FC<AppRootProps> = ({ children, embedded, partial, sizeX, hasMouse, noLegacyClasses = false }) => {
  if (embedded && partial) {
    console.error('[AppRoot] Can not be both embedded & partial');
  }
  const globalMode = !embedded && !partial;

  const rootRef = useRef<HTMLDivElement>();
  const [portalRoot, setPortalRoot] = useState<HTMLDivElement>(null);
  const { window, document } = useDOM();

  const initialized = useRef(false);
  if (!initialized.current) {
    if (window && globalMode) {
      document.documentElement.classList.add('vkui');
    }
    classScopingMode.noConflict = noLegacyClasses;
    initialized.current = true;
  }

  // setup portal
  useIsomorphicLayoutEffect(() => {
    if (globalMode) {
      return noop;
    }

    const portal = document.createElement('div');
    portal.classList.add('vkui__portal-root');
    document.body.appendChild(portal);
    setPortalRoot(portal);
    return () => portal.parentElement.removeChild(portal);
  }, []);

  // setup root classes
  useIsomorphicLayoutEffect(() => {
    if (partial) {
      return noop;
    }

    const parent = rootRef.current.parentElement;
    const classes = ['vkui__root'].concat(embedded ? 'vkui__root--embedded' : []);
    parent.classList.add(...classes);

    return () => {
      parent.classList.remove(...classes);
      if (globalMode) {
        document.documentElement.classList.remove('vkui');
      }
    };
  }, []);

  // adaptivity handler
  useIsomorphicLayoutEffect(() => {
    const container = embedded ? rootRef.current.parentElement : document.body;
    if (sizeX === SizeType.REGULAR) {
      container.classList.add('vkui--sizeX-regular');
    }
    return () => container.classList.remove('vkui--sizeX-regular');
  }, [sizeX]);

  const content = (
    <AppRootContext.Provider value={{
      appRoot: rootRef,
      portalRoot: portalRoot,
      embedded,
    }}>
      <IconSettingsProvider classPrefix="vkui" globalClasses={!noLegacyClasses}>
        {children}
      </IconSettingsProvider>
    </AppRootContext.Provider>
  );

  return partial
    ? content
    : <div ref={rootRef} vkuiClass={classNames('AppRoot', { 'AppRoot--no-mouse': !hasMouse })}>{content}</div>;
};

export default withAdaptivity(AppRoot, {
  sizeX: true,
  hasMouse: true,
});
