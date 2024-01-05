'use client'

import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  KeyboardEventHandler,
  forwardRef,
  useState,
  useRef,
  MouseEventHandler,
} from 'react'
import { Combobox, Listbox } from '@headlessui/react'
import {
  Controller,
  useController,
  useForm,
  useFormContext,
} from 'react-hook-form'
import { z } from 'zod'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'

import { isEmpty } from '@/utils/validator'
import { categoryCreateInputSchema } from '@/types/schema'
import useBoolean from '@/hooks/useBoolean'
import { useOutsideClick } from '@/hooks/useOutsideClick'

import StyledSelectButton from './styled-select-button'

type Category = {
  id: string
  title: string
}

interface Props {
  categories: Category[]
  name: string
}

const CategorySelect = ({ categories, name }: Props) => {
  const { control } = useFormContext()
  const {
    field: { value, onChange },
  } = useController({ control, name, defaultValue: {} })

  const { on, turnOff: close, turnOn: open } = useBoolean()
  const combobox = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  useOutsideClick({ outsideRef: combobox, action: close })

  const [query, setQuery] = useState('')
  const filteredCategories = !query
    ? categories
    : categories.filter(({ title }) =>
        title.toLowerCase().includes(query.trim().toLowerCase())
      )
  const 일치_카테고리 = categories.find(({ title }) => title === query)

  const openCombobox: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    open()
    console.log(e)
    if (input.current?.focus) {
      console.log('focus')
      setTimeout(() => input.current?.focus())
    }
  }

  const selectCategory = (c: Category) => {
    onChange(c)
    close()
  }

  return (
    <div className="relative">
      <button
        type="button"
        role="combobox"
        onClick={openCombobox}
        aria-expanded={on}
        aria-controls="category-combobox"
      >
        <StyledSelectButton>
          {value?.title ?? '카테고리 선택'}
        </StyledSelectButton>
      </button>
      <div
        ref={combobox}
        id="category-combobox"
        data-visible={on}
        className="absolute w-60 top-0 left-0 bg-white border border-gray-200 rounded shadow-md overflow-auto z-20 hidden data-[visible=true]:block"
      >
        <Combobox value={value} onChange={selectCategory}>
          <div className="flex py-2 px-4">
            <Combobox.Input
              ref={input}
              autoFocus
              placeholder="카테고리 이름 입력"
              className="focus:outline-none placeholder:text-gray-400 flex-1"
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
                key={category.id}
                value={category}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-900 ${
                    active ? 'bg-neutral-100' : 'bg-white'
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span className="block">{category.title}</span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-900">
                        <CheckIcon className="h-4 w-4 stroke-2" aria-hidden />
                      </span>
                    ) : null}
                  </>
                )}
              </Combobox.Option>
            ))}

            {query && !일치_카테고리 ? (
              <Combobox.Option
                value={{ title: query }}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-900 border-t-[1px] border-t-gray-200 ${
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
  )
}

export default CategorySelect
