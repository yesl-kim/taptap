'use client'

import { createPortal } from 'react-dom'

const MyPortal = ({ children }) => createPortal(children, document.body)

export default MyPortal
