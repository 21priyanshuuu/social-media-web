'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
export default function SubmissionForm() {
  const [name, setName] = useState('');
  const [socialHandle, setSocialHandle] = useState('');
  const [images, setImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth/signin');
    },
  });
  console.log(session?.user)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log(images)
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('socialHandle', socialHandle);
      
      if (images) {
        Array.from(images).forEach(image => {
          formData.append('images', image);
        });
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setName('');
        setSocialHandle('');
        setImages(null);
        alert('Submission successful!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto pt-14">
      <div className="w-5/6	 mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl text-black font-bold mb-6 text-center">Social Media Submission</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Social Media Handle"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={socialHandle}
              onChange={(e) => setSocialHandle(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="file"
              multiple
              accept="image/*"
              className="w-full text-black px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setImages(e.target.files)}
              
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-100 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}
