import React, { useState } from 'react'
import { Button, TextInput, Modal, IconEdit, DropDown } from '@aragon/ui'
import { DeadlineUnit } from '../../../constants'

import SectionHeader from '../../../components/SectionHeader'

type EditOrderDeadlineModalProps = {
  setDeadline: React.Dispatch<React.SetStateAction<number>>
  setFinalDeadlineUnit: React.Dispatch<React.SetStateAction<DeadlineUnit>>
}

const items = [DeadlineUnit.Seconds, DeadlineUnit.Minutes, DeadlineUnit.Hours, DeadlineUnit.Days]

export default function EditOrderDeadlineModal({ setDeadline, setFinalDeadlineUnit }: EditOrderDeadlineModalProps) {
  // const [deadline, setDeadline] = useState<number>(20)
  const [deadlineModalOpened, setDeadlineModalOpened] = useState(false)

  // deadline input is set to deadline when the user click on confirm
  const [deadlineInput, setDeadlineInput] = useState(20)
  const [modalDeadlineIdx, setModalDeadlineIdx] = useState<number>(0)

  // const [finalDeadlineUnit, setFinalDeadlineUnit] = useState<DeadlineUnit>(DeadlineUnit.Minutes)

  return (
    <>
      <Button
        label={'edit time'}
        size="mini"
        display="icon"
        icon={<IconEdit />}
        onClick={() => setDeadlineModalOpened(true)}
      />
      <Modal
        padding={30}
        visible={deadlineModalOpened}
        closeButton={true}
        onClose={() => setDeadlineModalOpened(false)}
      >
        <SectionHeader title="Set deadline" paddingTop={0} />
        Order will automatically become invalid after
        <br />
        <div style={{ display: 'flex' }}>
          <TextInput type="number" value={deadlineInput} onChange={e => setDeadlineInput(e.target.value)} />
          <DropDown
            items={items}
            selected={modalDeadlineIdx}
            onChange={idx => {
              setModalDeadlineIdx(idx)
              setDeadlineModalOpened(true)
            }}
          />
        </div>
        <br />
        <Button
          label="Confirm"
          onClick={() => {
            setDeadlineModalOpened(false)
            setFinalDeadlineUnit(items[modalDeadlineIdx])
            setDeadline(deadlineInput)
          }}
        />
      </Modal>
    </>
  )
}
