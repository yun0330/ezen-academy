
import { useOktaAuth } from "@okta/okta-react";
import { Link } from "react-router-dom";

export const Heros = () => {

    const { authState } = useOktaAuth();

    return (
        <div>
            <div className='d-none d-lg-block'>
                <div className='row g-0 mt-5'>
                    <div className='col-sm-6 col-md-6'>
                        <div className='col-image-left'></div>
                    </div>
                    <div className='col-4 col-md-4 container d-flex justify-content-center align-items-center'>
                        <div className='ml-2'>
                            <h1>최근 읽은 책이 무엇인가요?</h1>
                            <p className='lead'>
                                도서관 팀은 당신이 최근 읽은 책을 알고 싶어합니다.
                                새로운 기술을 배우거나 자신을 성장시키기 위해 읽은 책이라면,
                                우리는 당신을 위해 최고의 콘텐츠를 제공할 수 있습니다!
                            </p>
                            {authState?.isAuthenticated ? 
                                <Link type='button' className='btn main-color btn-lg text-white'
                                    to='search'>인기 도서 탐색</Link>
                                :
                                <Link className='btn main-color btn-lg text-white' to='/login'>가입하기</Link>
                            }  
                        </div>
                    </div>
                </div>
                <div className='row g-0'>
                    <div className='col-4 col-md-4 container d-flex 
                        justify-content-center align-items-center'>
                        <div className='ml-2'>
                            <h1>우리의 컬렉션은 항상 변화합니다!</h1>
                            <p className='lead'>
                                우리의 컬렉션은 항상 변화하므로 매일 확인해 보세요!
                                우리는 Luv 2 Read 학생들을 위해 가장 정확한 책 선택을 제공하기 위해
                                끊임없이 노력하고 있습니다! 우리는 책 선택에 대해 엄격하게 관리하며,
                                책은 항상 우리의 최우선 사항입니다.
                            </p>
                        </div>
                    </div>
                    <div className='col-sm-6 col-md-6'>
                        <div className='col-image-right'></div>
                    </div>
                </div>
            </div>

            {/* Mobile Heros */}
            <div className='d-lg-none'>
                <div className='container'>
                    <div className='m-2'>
                        <div className='col-image-left'></div>
                        <div className='mt-2'>
                            <h1>최근 읽은 책이 무엇인가요?</h1>
                            <p className='lead'>
                                도서관 팀은 당신이 최근 읽은 책을 알고 싶어합니다.
                                새로운 기술을 배우거나 자신을 성장시키기 위해 읽은 책이라면,
                                우리는 당신을 위해 최고의 콘텐츠를 제공할 수 있습니다!
                            </p>
                            {authState?.isAuthenticated ? 
                                <Link type='button' className='btn main-color btn-lg text-white'
                                    to='search'>인기 도서 탐색</Link>
                                :
                                <Link className='btn main-color btn-lg text-white' to='/login'>가입하기</Link>
                            }
                        </div>
                    </div>
                    <div className='m-2'>
                        <div className='col-image-right'></div>
                        <div className='mt-2'>
                            <h1>우리의 컬렉션은 항상 변화합니다!</h1>
                            <p className='lead'>
                                우리의 컬렉션은 항상 변화하므로 매일 확인해 보세요!
                                우리는 Luv 2 Read 학생들을 위해 가장 정확한 책 선택을 제공하기 위해
                                끊임없이 노력하고 있습니다! 우리는 책 선택에 대해 엄격하게 관리하며,
                                책은 항상 우리의 최우선 사항입니다.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
