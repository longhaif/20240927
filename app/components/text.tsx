import React, { useRef } from 'react';
 
const DragAndDropUpload = () => {
  const dropRef = useRef(null);
 
  const handleDragOver = (event) => {
    event.preventDefault();
  };
 
  const handleDrop = (event) => {
    event.preventDefault();
    // const files = event.dataTransfer.files;
    console.log(event,'sssss');
    
    // uploadFiles(files);
  };
 
  const uploadFiles = (files) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }
 
    // 这里替换为你的上传API地址
    fetch('your-upload-api-url', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
  };
 
  return (
    <div
      ref={dropRef}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ width: '100%', height: '200px', border: '2px dashed #ccc' }}
    >
      拖拽文件到此处上传
    </div>
  );
};
 
export default DragAndDropUpload;