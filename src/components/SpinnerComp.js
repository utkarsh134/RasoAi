import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

function SpinnerComp() {
  return (
    <div style={{display: "flex", flexDirection:"column", marginTop: "40px", justifyContent:"center", alignItems:"center"}}>
      <div class="spinner-border text-info" role="status">
      </div>
        <span class="sr-only">Loading...</span>
    </div>
  );
}

export default SpinnerComp;
