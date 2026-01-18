export default function FileLoader({ logs, logsClick }) {
  function handleFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        logsClick(true, data);
      } catch (err) {
        alert("Invalid JSON file");
      }
    };

    reader.readAsText(file);
  }

  return (
    <div className=" h-screen flex flex-col items-center justify-center">
      <div className="border-2 border-dashed border-gray-300 rounded p-6 text-center cursor-pointer">
        <p className="mb-3 text-gray-600">Upload your PixelLog JSON file</p>
        <input type="file" accept="application/json" onChange={handleFile} className=" border-2 border-dashed border-gray-300 rounded p-6 pl-5 cursor-pointer"/>
      </div>
        
    </div>
  );
}
