import React, { ReactChild } from 'react'

type commentProps = {
  text: string | ReactChild
  padding?: number
}

function Comment({ text, padding = 10 }: commentProps) {
  return <div style={{ padding, opacity: 0.7 }}>{text}</div>
}

export default Comment
