import { SortableContext, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import "./App.css";
import { DndContext, DragEndEvent, DragStartEvent, KeyboardSensor, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { useState } from "react";
import { ImageGallery } from "./types/global.types";
import { initialImageData } from "./data";
import ImageCard from "./components/Cards/ImageCard";

function App() {
  const [galleryData, setGalleryData] = useState(initialImageData)
  const handleSelectImage = (id: string | number) => {
    // if galleryData.isSelected === true then set to false and vice versa
    const newGalleryData = galleryData.map((imageItem) => {
      if (imageItem.id === id) {
        return {
          ...imageItem,
          isSelected: !imageItem.isSelected,
        };
      }

      return imageItem;
    });

    setGalleryData(newGalleryData);
  };
  // dnd code start here

  const [activeItem, setActiveItem] = useState<ImageGallery | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor), 
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor)
  );
  const handleDragStart = (event: DragStartEvent ) => {
    const { id } = event.active;

    if (!id) return;

    const currentItem = galleryData.find((item) => item.id === id);

    setActiveItem(currentItem || null);
  };
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveItem(null);
    const { active, over } = event;

    if (!over) {
      return;
    }

    if (active.id !== over.id) {
      setGalleryData((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  return (
    <div className="min-h-screen">
      <div className="container flex flex-col items-center">
        <div className="grid max-w-5xl my-8 bg-white divide-y rounded-lg shadow">
          <header className="text-2xl">Showcase</header>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-2 gap-8 p-8 md:grid-cols-5">
            <SortableContext
                items={galleryData}
                strategy={rectSortingStrategy}
              >
                {galleryData.map((imageItem) => {
                  return (
                    <ImageCard
                      key={imageItem.id}
                      id={imageItem.id}
                      isSelected={imageItem.isSelected}
                      slug={imageItem.slug}
                      onClick={handleSelectImage}
                    />
                  );
                })}
              </SortableContext>
            </div>
          </DndContext>
        </div>
      </div>
    </div>
  );
}

export default App;
