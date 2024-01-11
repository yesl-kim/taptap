'use client'

import { KeyboardEventHandler, useCallback, useRef, useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { useController, useFormContext } from 'react-hook-form'

import useBoolean from '@/hooks/useBoolean'
import { useOutsideClick } from '@/hooks/useOutsideClick'

import BasicSelectButton from '../basic-select-button'

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

// TODO: apply headless ui - listbox
interface Props {
  name: string
}

export default function ColorSelect({ name }: Props) {
  const { on, toggle, turnOff: closeMenu, turnOn: openMenu } = useBoolean()

  const listRef = useRef<HTMLUListElement>(null)
  const [focusedIndex, setFocusedIndex] = useState(0)

  const outsideRef = useRef<HTMLDivElement>(null)
  const close = useCallback(() => {
    setFocusedIndex(0)
    closeMenu()
  }, [closeMenu])
  useOutsideClick({ outsideRef, action: close })

  const { control } = useFormContext()
  const {
    field: { value, onChange },
  } = useController({ control, name, defaultValue: options[0] })

  const select = useCallback(
    (newValue: string) => {
      onChange(newValue)
      close()
    },
    [close, onChange]
  )

  const selectByKeyboard: KeyboardEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.preventDefault()
      if (e.key === KEY.enter) {
        if (!on) {
          openMenu()
          return
        }

        const newValue =
          listRef.current?.children[focusedIndex].getAttribute(
            ITEM_DATA_ATTR
          ) ?? ''
        select(newValue)
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
    [focusedIndex, select, openMenu, on]
  )

  return (
    <div className="relative" ref={outsideRef} onKeyDown={selectByKeyboard}>
      <BasicSelectButton
        type="button"
        active={on}
        aria-haspopup
        aria-expanded={on}
        aria-controls="color-select-field"
        onClick={toggle}
        value={value}
      >
        <div
          className="w-[20px] h-[20px] rounded-full"
          style={{ backgroundColor: value }}
        />
      </BasicSelectButton>

      {on && (
        <ul
          ref={listRef}
          autoFocus
          role="listbox"
          id="color-select-field"
          className="absolute shadow-md flex w-[62px] flex-wrap py-3 gap-2 justify-center rounded-md border border-gray-200 bg-white z-20"
        >
          {options.map((color, idx) => (
            <li
              key={color}
              className="w-[16px] h-[16px] rounded-full data-[focused=true]:ring-2 cursor-pointer hover:shadow-inner"
              style={{ backgroundColor: color }}
              onClick={() => select(color)}
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
