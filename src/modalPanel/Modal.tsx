import styled from 'styled-components'
import Sampler from './Sampler'

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);

  &.display-block {
    display: block;
  }

  &.display-none {
    display: none;
  }
`

const ModalMain = styled.div`
  position: fixed;
  background: var(--panel-color-1);
  width: 80%;
  height: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
`

const ModalHeader = styled.div`
  display: flex;
  background-color: var(--off-color-2);
  border-radius: 5px 5px 0px 0px;
  div {
    font-size: 1.3rem;
    padding: 10px;
  }
  button {
    margin-left: auto;
  }
`

export default function ModalBox(props: { show: boolean; hideModal: () => void }) {
  return (
    <Modal className={props.show ? 'display-block' : 'display-none'}>
      <ModalMain>
        <ModalHeader>
          <div>Sampler</div>
          <button onClick={props.hideModal}>close</button>
        </ModalHeader>
        <Sampler />
      </ModalMain>
    </Modal>
  )
}
