'use client'

import useBoolean from '@/lib/useBoolean'
import { useOutsideClick } from '@/lib/useOutsideClick'
import {
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import { ChevronDownIcon } from '@heroicons/react/24/outline'

const options = [
  '#073b4c',
  '#005f73',
  '#94d2bd',
  '#0a9396',
  '#e9d8a6',
  '#ee9b00',
  '#ca6702',
  '#bb3e03',
  '#ae2012',
  '#9b2226',
  '#344e41',
  '#3a5a40',
  '#588157',
  '#a3b18a',
  '#dad7cd',
  '#cac5b8',
  '#98948a',
  '#65635c',
  '#33312e',
  '#000000',
]

const ITEM_DATA_ATTR = 'data-value'
const FOCUSED_ATTR = 'data-focused'
const KEY = {
  down: 'ArrowDown',
  up: 'ArrowUp',
  right: 'ArrowRight',
  left: 'ArrowLeft',
  enter: 'Enter',
}
const defaultValue = options[0]

// FIXME: 기존에 설정한 값이 있으면 그 값이 기본값

export default function ColorField() {
  const { on, toggle, turnOff: closeMenu } = useBoolean()

  const listRef = useRef<HTMLUListElement>(null)
  const [focusedIndex, setFocusedIndex] = useState(0)

  const outsideRef = useRef<HTMLDivElement>(null)
  const close = useCallback(() => {
    setFocusedIndex(0)
    closeMenu()
  }, [closeMenu])
  useOutsideClick({ outsideRef, action: close })

  const [value, setValue] = useState<string>(defaultValue)
  const onChange = useCallback(
    (newValue: string) => {
      setValue(newValue)
      close()
    },
    [close]
  )

  const selectByKeyboard: KeyboardEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      console.log(e.key)
      e.preventDefault()
      if (e.key === KEY.enter) {
        const newValue =
          listRef.current?.children[focusedIndex].getAttribute(
            ITEM_DATA_ATTR
          ) ?? ''
        onChange(newValue)
        return
      }

      if (e.key === KEY.down || e.key === KEY.right) {
        setFocusedIndex((prev) => (prev + 1) % options.length)
        return
      }

      if (e.key === KEY.up || e.key === KEY.left) {
        const lastIndex = options.length - 1
        setFocusedIndex((prev) => (prev === 0 ? lastIndex : prev - 1))
        return
      }
    },
    [focusedIndex, onChange]
  )

  return (
    <div className="relative" ref={outsideRef} onKeyDown={selectByKeyboard}>
      <input hidden name="color" value={value} readOnly />
      <button
        type="button"
        aria-haspopup
        aria-expanded={on}
        aria-controls="color-select-field"
        onClick={toggle}
        className="flex gap-3 items-center p-2 outline-none focus:outline-none"
      >
        <div
          className="w-[20px] h-[20px] rounded-full"
          style={{ backgroundColor: value }}
        />
        <ChevronDownIcon className="w-3" strokeWidth={3} />
      </button>

      {on && (
        <ul
          ref={listRef}
          autoFocus
          role="listbox"
          id="color-select-field"
          className="absolute shadow-md flex w-[62px] flex-wrap py-3 gap-2 justify-center rounded-md bg-white"
        >
          {options.map((color, idx) => (
            <li
              key={color}
              className="w-[16px] h-[16px] rounded-full data-[focused=true]:ring-2"
              style={{ backgroundColor: color }}
              onClick={() => onChange(color)}
              {...{
                [ITEM_DATA_ATTR]: color,
                [FOCUSED_ATTR]: idx === focusedIndex,
              }}
            >
              <span className="sr-only">{color}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
