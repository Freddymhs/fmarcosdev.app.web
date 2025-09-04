interface Card {
  id: string | number;
  richContent: React.ReactNode;
  // Agrega otras propiedades que tenga tu card aquí
}

interface ModalContentProps {
  cards: Card[];
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  selectedCard: string | number | null;
}

const ModalContent = ({
  cards,
  showModal,
  setShowModal,
  selectedCard,
}: ModalContentProps) => {
  if (!showModal || !selectedCard) return null;

  const foundCard = cards.find((card) => card.id === selectedCard);

  if (!foundCard) return null;

  const { richContent } = foundCard;

  return (
    <div className="fixed inset-0 z-[10000]  bg-opacity-80 flex items-center justify-center p-4">
      {/* Overlay clickeable para cerrar */}
      <div className="absolute inset-0" onClick={() => setShowModal(false)} />

      {/* Contenido del modal */}
      <div className="relative bg-white w-full w-full max-h-[90vh] overflow-hidden rounded-lg shadow-xl">
        {/* Botón de cerrar */}
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700 text-xl font-bold bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-colors"
          aria-label="Cerrar modal"
        >
          ✕
        </button>

        {/* Contenido scrolleable */}
        <div className="overflow-y-auto max-h-[90vh] p-6">
          <div className="prose max-w-none">{richContent}</div>
        </div>
      </div>
    </div>
  );
};

export default ModalContent;
