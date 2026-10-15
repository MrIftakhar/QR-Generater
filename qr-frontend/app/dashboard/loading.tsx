export default function DashboardLoading() {
  return (
    <div className="container text-center mt-5 py-5">
      <div className="spinner-border text-success" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}