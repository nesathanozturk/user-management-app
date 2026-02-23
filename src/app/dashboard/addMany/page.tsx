import ExcelUpload from "@/components/ExcelUpload";

const BulkUploadPage = () => {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bulk Upload Users</h1>
        <p className="mt-1 text-sm text-gray-600">
          Upload an Excel file to create multiple users at once.
        </p>
      </div>

      <ExcelUpload />
    </div>
  );
};

export default BulkUploadPage;
