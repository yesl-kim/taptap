'use client'

import { KeyboardEventHandler, useCallback, useRef, useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { useController, useFormContext } from 'react-hook-form'

import useBoolean from '@/hooks/useBoolean'
import { useOutsideClick } from '@/hooks/useOutsideClick'

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
// TODO: apply headless ui - listbox

// TODO: props - name, onChange, ref, value ... (rhf register return value) -> rules 적용되는지 확인
// validation 로직이 task form에 한 번에 있는게 좋지 않을까
interface Props {
  name: string
}

export default function ColorField({ name }: Props) {
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
      <input hidden name="color" value={value} readOnly />
      <button
        type="button"
        aria-haspopup
        aria-expanded={on}
        aria-controls="color-select-field"
        onClick={toggle}
        className="flex gap-3 items-center p-2 focus-visible:outline-2"
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
          className="absolute shadow-md flex w-[62px] flex-wrap py-3 gap-2 justify-center rounded-md bg-white z-20"
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
