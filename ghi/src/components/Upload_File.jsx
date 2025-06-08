import React , { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { setResume } from '../store/slice';

const ResumeUpload = ({ onFileSelect }) => {
  const [resume, setResume] = useState(null);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setResume(file);
      onFileSelect(file); // 👈 pass to parent
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx'],
    },
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: '2px dashed #ccc',
        padding: '2rem',
        borderRadius: '10px',
        textAlign: 'center',
        backgroundColor: isDragActive ? '#f0f8ff' : 'white',
      }}
    >
      <input {...getInputProps()} />
      <p>
        {resume ? `Selected file: ${resume.name}` : 'Drag and drop your resume here, or click to select a file'}
      </p>
    </div>
  );
};

export default ResumeUpload;
