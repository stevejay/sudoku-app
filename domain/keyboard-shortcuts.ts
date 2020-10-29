import Mousetrap from "mousetrap";
import { EventData } from "xstate";

export type KeyboardShortcut<TEvent> = Readonly<{
  keys: string | string[];
  event: TEvent;
}>;

export type KeyboardShortcuts<TEvent> = readonly KeyboardShortcut<TEvent>[];

export function bindKeyboardShortcuts<TEvent>(
  keyboardShortcuts: KeyboardShortcuts<TEvent>,
  send: (event: TEvent, payload?: EventData) => unknown
) {
  keyboardShortcuts.map((shortcut) => {
    Mousetrap.bind(shortcut.keys, (event) => {
      if (shortcut.event) {
        send(shortcut.event);
      }
      event.preventDefault();
      event.stopPropagation();
    });
  });
  return () => {
    keyboardShortcuts.map((shortcut) => {
      Mousetrap.unbind(shortcut.keys);
    });
  };
}
