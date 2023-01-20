import { useState, useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import './styles.css';
export const ImageFilter: React.FC = () => {
  const [image, setImage] = useState<fabric.Image>();
  const [filter, setFilter] = useState<string>('vintage');
  const [filterStrength, setFilterStrength] = useState<number>(50);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files == null) {
      return;
    }
    const file = e.target.files[0];
    fabric.Image.fromURL(URL.createObjectURL(file), (img) => {
      setImage(img);
    });
  };

  const handleFilterSelect = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ): void => {
    setFilter(e.target.value);
  };

  const handleFilterStrength = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setFilterStrength(+e.target.value);
  };

  const handleDownload = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const format = e.currentTarget.dataset.format ?? 'png';
    image.getElement().toBlob((blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `image.${format}`;
      link.click();
    }, `image/${format}`);
  };

  useEffect(() => {
    if (image == null) {
      return;
    }
    switch (filter) {
      case 'vintage': {
        const vintage = new fabric.Image.filters.Vintage();
        image.filters = [vintage];
        break;
      }

      case 'sepia': {
        const sepia = new fabric.Image.filters.Sepia();
        image.filters = [sepia];
        break;
      }

      case 'blur': {
        const blur = new fabric.Image.filters.Blur({
          blur: filterStrength / 100,
        });
        image.filters = [blur];
        break;
      }

      default:
        break;
    }
    image.applyFilters();
    image.canvas?.renderAll();
  }, [filter, filterStrength, image]);

  useEffect(() => {
    if (image == null) {
      return;
    }
    const canvas = new fabric.Canvas(canvasRef.current);
    canvas.add(image);
  }, [image]);

  return (
    <>
      <div className="header">
        <input type="file" onChange={handleFileSelect} />
        <div>
          <label>Filter: </label>
          <select onChange={handleFilterSelect} value={filter}>
            <option value="vintage">Vintage</option>
            <option value="sepia">Sepia</option>
            <option value="blur">Blur</option>
          </select>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={filterStrength}
          onChange={handleFilterStrength}
          disabled={filter !== 'blur'}
        />
        <button data-format="png" onClick={handleDownload}>
          Download as PNG
        </button>
        <button data-format="jpeg" onClick={handleDownload}>
          Download as JPEG
        </button>
      </div>{' '}
      <div className="container">
        <canvas ref={canvasRef} width={'1000px'} height={'1000px'} />
      </div>
    </>
  );
};
