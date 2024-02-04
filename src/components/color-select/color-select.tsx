'use client'

import {
  KeyboardEventHandler,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import useBoolean from '@/hooks/useBoolean'
import { useOutsideClick } from '@/hooks/useOutsideClick'
import { defaultColorOptions } from '@/constants/task'

import BasicSelectButton from '../basic-select-button'
import { FOCUSED_ATTR, ITEM_DATA_ATTR, KEY } from './color-select.constants'
import FieldError from '../field-error'

// TODO: apply headless ui - listbox
type Props = {
  options?: string[]
  onChange: (value: string) => void
  value?: string
  error?: string
}

const ColorSelect = forwardRef<HTMLButtonElement, Props>(
  ({ options = defaultColorOptions, value, onChange, error }, buttonRef) => {
    const { on, toggle, turnOff: closeMenu, turnOn: openMenu } = useBoolean()

    const listRef = useRef<HTMLUListElement>(null)
    const [focusedIndex, setFocusedIndex] = useState(0)

    const outsideRef = useRef<HTMLDivElement>(null)
    useOutsideClick({ outsideRef, action: closeMenu })

    const select = useCallback(
      (newValue: string) => {
        onChange(newValue)
        setFocusedIndex(options.findIndex((option) => option === newValue))
        closeMenu()
      },
      [onChange, closeMenu, options],
    )

    const selectByKeyboard: KeyboardEventHandler<HTMLDivElement> = useCallback(
      (e) => {
        if (e.key === KEY.enter) {
          e.preventDefault()
          if (!on) {
            openMenu()
            return
          }

          const newValue =
            listRef.current?.children[focusedIndex].getAttribute(
              ITEM_DATA_ATTR,
            ) ?? ''
          select(newValue)
          return
        }

        if (e.key === KEY.down || e.key === KEY.right) {
          e.preventDefault()
          setFocusedIndex((prev) => (prev + 1) % options.length)
          return
        }

        if (e.key === KEY.up || e.key === KEY.left) {
          e.preventDefault()
          const lastIndex = options.length - 1
          setFocusedIndex((prev) => (prev === 0 ? lastIndex : prev - 1))
          return
        }

        if (e.key === KEY.tab) {
          closeMenu()
        }
      },
      [focusedIndex, select, openMenu, on, closeMenu, options],
    )

    return (
      <div className="relative" ref={outsideRef} onKeyDown={selectByKeyboard}>
        <BasicSelectButton
          ref={buttonRef}
          type="button"
          active={on}
          aria-haspopup
          aria-expanded={on}
          aria-controls="color-select-field"
          onClick={toggle}
          value={value}
        >
          <div
            className="h-[20px] w-[20px] rounded-full"
            style={{ backgroundColor: value }}
          />
        </BasicSelectButton>

        {on && (
          <ul
            ref={listRef}
            autoFocus
            role="listbox"
            id="color-select-field"
            className="absolute z-20 flex w-[62px] flex-wrap justify-center gap-2 rounded-md border border-gray-200 bg-white py-3 shadow-md"
          >
            {options.map((color, idx) => (
              <li
                key={color}
                className="h-[16px] w-[16px] cursor-pointer rounded-full hover:shadow-inner data-[focused=true]:ring-2"
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

        <FieldError message={error} />
      </div>
    )
  },
)

ColorSelect.displayName = 'ColorSelect'

export default memo(ColorSelect)
