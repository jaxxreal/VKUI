import React, { createContext, useContext, ComponentType } from 'react';
import { canUseDOM } from '@vkontakte/vkjs/lib/dom';
export { canUseDOM, canUseEventListeners, onDOMLoaded } from '@vkontakte/vkjs/lib/dom';

export interface DOMContextInterface {
  window?: Window;
  document?: Document;
}

export type DOMProps = DOMContextInterface;

export const DOMContext = createContext<DOMContextInterface>({
  window: canUseDOM ? window : null,
  document: canUseDOM ? document : null,
});

export const useDOM = () => {
  const dom = useContext(DOMContext);
  return {
    window: dom.window || canUseDOM ? window : null,
    document: dom.document || canUseDOM ? document : null,
  };
};

export function withDOM<Props>(Component: ComponentType<Props & DOMProps>): ComponentType<Props> {
  function WithDOM(props: Props) {
    const dom = useDOM();
    return <Component {...props} {...dom} />;
  };
  return WithDOM;
}
