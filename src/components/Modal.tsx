import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    setShow(isOpen);
    if (isOpen) {
      const timeout = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, onClose]);

  return (
    <Transition show={show} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 flex items-start justify-center pointer-events-none" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="transition ease-out duration-300"
          enterFrom="opacity-0 translate-y-[-16px]"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-0"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-[-16px]"
        >
          <Dialog.Panel className="mt-6 bg-white/90 backdrop-blur-sm text-gray-800 border border-gray-200 shadow-xl rounded-lg px-6 py-4 text-sm pointer-events-auto max-w-sm w-full mx-auto">
            {children}
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
