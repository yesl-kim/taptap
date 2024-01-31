'use client'

import {
  useState,
  useRef,
  MouseEventHandler,
  memo,
  useCallback,
  useMemo,
  forwardRef,
} from 'react'
import { Combobox } from '@headlessui/react'
import {
  ChevronDownIcon,
  CheckIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'

import useBoolean from '@/hooks/useBoolean'
import { useOutsideClick } from '@/hooks/useOutsideClick'

import BasicSelectButton from '@/components/basic-select-button'
import FieldError from '../field-error'

export type Category = {
  title: string
}

interface Props {
  categories: Category[]
  onChange: (c: Category) => void
  value?: Category
  error?: string
}

const CategorySelect = forwardRef<HTMLButtonElement, Props>(({ categories, value, onChange, error }, buttonRef) => {
  const input = useRef<HTMLInputElement>(null)
  const combobox = useRef<HTMLDivElement>(null)
  const { on, turnOff: close, turnOn: open } = useBoolean()

  useOutsideClick({ outsideRef: combobox, action: close })

  const [query, setQuery] = useState('')
  const filteredCategories = useMemo(
    () =>
      !query
        ? categories
        : categories.filter(({ title }) =>
            title.toLowerCase().includes(query.trim().toLowerCase()),
          ),
    [categories, query],
  )

  const 일치_카테고리 = useMemo(
    () => categories.find(({ title }) => title === query),
    [categories, query],
  )

  const openCombobox: MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.preventDefault()
      open()
      if (input.current?.focus) {
        setTimeout(() => input.current?.focus())
      }
    },
    [open],
  )

  const selectCategory = useCallback(
    (c: Category) => {
      onChange(c)
      close()
    },
    [onChange, close],
  )

  return (
    <div>
      <div className="relative">
        <BasicSelectButton
        ref={buttonRef}
          type="button"
          role="combobox"
          onClick={openCombobox}
          aria-expanded={on}
          aria-controls="category-combobox"
        >
          {value?.title ?? '카테고리 선택'}
        </BasicSelectButton>
        <div
          ref={combobox}
          id="category-combobox"
          data-visible={on}
          className="absolute left-0 top-0 z-20 hidden w-60 overflow-auto rounded border border-gray-200 bg-white shadow-md data-[visible=true]:block"
        >
          <Combobox value={value ?? ''} onChange={selectCategory}>
            <div className="flex px-4 py-2">
              <Combobox.Input
                ref={input}
                autoFocus
                placeholder="카테고리 이름 입력"
                className="flex-1 text-sm placeholder:text-sm placeholder:text-gray-400 focus:outline-none"
                displayValue={(c: Category) => c.title}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Combobox.Button>
                <ChevronDownIcon aria-hidden className="w-3" strokeWidth={3} />
              </Combobox.Button>
            </div>
            <Combobox.Options
              static
              className="max-h-60 w-full overflow-auto bg-white focus:outline-none sm:text-sm"
            >
              {filteredCategories.map((category) => (
                <Combobox.Option
                  key={category.title}
                  value={category}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-900 ${
                      active ? 'bg-neutral-100' : 'bg-white'
                    }`
                  }
                >
                  <span className="block">{category.title}</span>
                  {value?.title === category.title ? (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-900">
                      <CheckIcon className="h-4 w-4 stroke-2" aria-hidden />
                    </span>
                  ) : null}
                </Combobox.Option>
              ))}

              {query && !일치_카테고리 ? (
                <Combobox.Option
                  value={{ title: query }}
                  className={({ active }) =>
                    `relative cursor-pointer select-none border-t-[1px] border-t-gray-200 py-2 pl-10 pr-4 text-gray-900 ${
                      active ? 'bg-neutral-100' : 'bg-white'
                    }`
                  }
                >
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-900">
                    <PlusIcon className="h-4 w-4 stroke-2" aria-hidden />
                  </span>
                  &lsquo;<b className="font-medium">{query}</b>
                  &rsquo; 만들기
                </Combobox.Option>
              ) : null}
            </Combobox.Options>
          </Combobox>
        </div>
      </div>
      <FieldError message={error} />
    </div>
  )
})

CategorySelect.displayName = 'CategorySelect'

export default memo(CategorySelect)
