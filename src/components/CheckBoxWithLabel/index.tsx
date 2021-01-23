import React from 'react'
import { Checkbox } from '@aragon/ui'
import { storePreference } from '../../utils/storage'

type CheckBoxProps = {
  label: string
  checked: boolean
  setChecked: any
  storageKey?: string
}

export default function CheckBoxWithLabel({ storageKey, checked, setChecked, label }: CheckBoxProps) {
  return (
    <div style={{ display: 'flex', fontSize: 12, opacity: 0.7 }}>
      <div style={{ paddingTop: '5px' }}>
        <Checkbox
          checked={checked}
          onChange={(checked: boolean) => {
            setChecked(checked)
            if (storageKey) storePreference(storageKey, String(checked))
          }}
        />
      </div>
      <div style={{ padding: '8px' }}>{label}</div>
    </div>
  )
}
