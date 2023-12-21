import { Listbox } from '@headlessui/react'

export default function DateField() {
  return (
    <div>
      <input type="date" />
      <Listbox>
        <Listbox.Button>시작시간</Listbox.Button>
      </Listbox>
      <Listbox>
        <Listbox.Button>종료시간</Listbox.Button>
      </Listbox>
    </div>
  )
}
