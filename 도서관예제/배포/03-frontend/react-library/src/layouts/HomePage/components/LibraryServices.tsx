import { useOktaAuth } from "@okta/okta-react";
import { Link } from "react-router-dom";

export const LibraryServices = () => {

    const { authState } = useOktaAuth();

    return(
        <div className='container my-5'>
            <div className='row p-4 align-items-center border shadow-lg'>
                <div className='col-lg-7 p-3'>
                    <h1 className='display-4 fw-bold'>
                        찾으시는 책이 없나요?
                    </h1>
                    <p className='lead'>
                    찾고 있는 정보를 찾지 못하신 경우,
                    도서관 관리자에게 개인 메시지를 보내세요!
                    </p>
                    <div className='d-grid gap-2 justify-content-md-start mb-4 mb-lg-3'>
                        {authState?.isAuthenticated ? 
                        <Link to='/messages' type='button' className='btn main-color btn-lg px-4 me-md-2 fw-bold text-white'>
                            도서관 서비스
                        </Link>   
                        :
                        <Link className='btn main-color btn-lg text-white' to='/login'>
                            Sign up
                        </Link> 
                    }

                    </div>
                </div>
                <div className='col-lg-4 offset-lg-1 shadow-lg lost-image'></div>
            </div>
        </div>
    );
}