'use client'

import { useState } from 'react'
import { Combobox, Listbox } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

// mock data
const DATA = [
  { id: 1, title: 'category 1' },
  { id: 2, title: 'category 2' },
  { id: 3, title: 'category 3' },
]

type Category = {
  id: string
  title: string
}

interface Props {
  categories: Category[]
}

const CategorySelectt = ({ categories }: Props) => (
  <Listbox name="category">
    <div className="relative">
      <Listbox.Button className="flex gap-2 items-center p-2 outline-none focus:outline-none">
        {({ value }) => (
          <>
            <span>{value.title}</span>
            <ChevronDownIcon aria-hidden className="w-3" strokeWidth={3} />
          </>
        )}
      </Listbox.Button>
      <Listbox.Options className="absolute max-h-60 py-2 overflow-auto rounded-md bg-white shadow-lg focus:outline-none z-10 sm:text-sm">
        {DATA.map((category) => (
          <Listbox.Option
            key={category.id}
            value={category}
            className={({ active }) =>
              `cursor-pointer select-none py-2 px-4 text-gray-900 ${
                active && 'bg-neutral-200/70'
              }`
            }
          >
            {category.title}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </div>
  </Listbox>
)

const CategorySelect = ({ categories }: Props) => {
  const [query, setQuery] = useState('')
  const filteredCategories = categories.filter(({ title }) =>
    title.includes(query)
  )

  return (
    <Combobox>
      <div className="relative">
        <Combobox.Input
          onChange={(e) => setQuery(e.target.value)}
          placeholder="카테고리"
        />
        <Combobox.Options>
          {filteredCategories.map((category) => (
            <Combobox.Option key={category.id} value={category}>
              {category.title}
            </Combobox.Option>
          ))}
          <div></div>
        </Combobox.Options>
      </div>
    </Combobox>
  )
}

export default CategorySelect
