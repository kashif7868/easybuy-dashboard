// src/components/AddSlider.tsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSliderImage } from '../../app/reducer/sliderSlice';
import { selectSliderStatus, selectSliderError } from '../../app/reducer/sliderSlice';

const AddSlider: React.FC = () => {
  const dispatch = useDispatch();

  const status = useSelector(selectSliderStatus);
  const error = useSelector(selectSliderError);

  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle image file selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setImage(file);
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!image) {
      alert('Please select an image to upload');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    setIsSubmitting(true);
    dispatch(createSliderImage(formData))
      .unwrap()
      .then(() => {
        setIsSubmitting(false);
        alert('Slider image added successfully');
      })
      .catch(() => {
        setIsSubmitting(false);
        alert('Failed to add slider image');
      });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Add New Slider</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 border border-gray-200 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Choose Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-md"
          />
        </div>

        {status === 'loading' ? (
          <button
            type="submit"
            className="w-full py-2 bg-gray-500 text-white font-semibold rounded-md"
            disabled
          >
            Uploading...
          </button>
        ) : (
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md"
          >
            Upload Image
          </button>
        )}

        {status === 'failed' && error && (
          <div className="mt-4 text-center text-red-600">
            <p>Error: {error}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddSlider;
