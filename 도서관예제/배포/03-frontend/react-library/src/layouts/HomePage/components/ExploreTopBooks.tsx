
import { Link } from "react-router-dom";

export const ExploreTopBooks = () => {
    return (
        <div className='p-5 mb-4 bg-dark header'>
            <div className='container-fluid py-5 text-white 
                d-flex justify-content-center align-items-center'>
                <div>
                    <h1 className='display-5 fw-bold'>다음 모험을 찾아보세요</h1>
                    <p className='col-md-8 fs-4'>다음에 어디로 가고 싶으세요?</p>
                    <Link type='button' className='btn main-color btn-lg text-white' to='/search'>
                        인기 도서 탐색</Link>
                </div>
            </div>
        </div>
    );
}
