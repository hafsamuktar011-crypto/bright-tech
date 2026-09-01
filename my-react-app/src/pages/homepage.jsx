
import "../styles/home.css"

function Homepage({ onSignupClick }) {
  return (
    <div>
      <nav>
        <ul className="list">
          <li><a href="#">home</a></li>
          <li><a href="#">course</a></li>
          <li><a href="#">about</a></li>
        </ul>
        <ul className="signup">
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (onSignupClick) onSignupClick()
              }}
            >
              signup
            </a>
          </li>
        </ul>
      </nav>

      <div className="hero">
        <h1>Welcome to the Student Portal</h1>
        <p>Sign up or log in to get started.</p>
      </div>

      <div className="images">
        <div className="card">
                  <img src="/images/OIP (1).webp" alt="" />
                  <h3>java script</h3>
                  <p>with in two months</p>

        </div>

        <div className="card"> 
          <img src="/images/OIP.jpg" alt="" />
          <h3>FullStack</h3>
          <p>with in 6 months</p>
          </div>
          
        <div className="card">   
           <img src="/images/OIP.webp" alt="" />
           <h3>phyton programming</h3>
           <p>with in 3 months</p>
           </div>

       
    
      </div>




    </div>
  )
}

export default Homepage
