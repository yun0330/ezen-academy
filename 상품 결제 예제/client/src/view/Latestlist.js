
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Paging from '../Components/Paging';

const Latestlist = () => {

    const { categoryid, page } = useParams();
    const [products, setProducts] = useState([{
        id: '',
        name: '',
        price: '',
        thumbnail: '',
        date: ''
    }])

    const [count, setCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPosts, setCurrentPosts] = useState(0);
    const postPerPage = 9;
    const indexOfLastPost = page * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const title = ["리빙"]
    const Server_URL = process.env.REACT_APP_Server_Side_Address;

    useEffect(() => {
        async function fetchData() {
            try {
                const rawData = await axios.get(`${Server_URL}/shop`, {});
                const categoryData = rawData.data.filter((it) => it.category.toString() === categoryid.toString());
                const prodData = categoryData.map((it) => ({
                    id: it.prodid,
                    name: it.title,
                    price: it.price,
                    thumbnail: it.thumbnail,
                    date: it.date
                }));
                const sortedProd = [...prodData].sort((a, b) => Number(b.id) - Number(a.id));
                setProducts(sortedProd);
                setCount(sortedProd.length);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [categoryid]);

    useEffect(() => {
        setCurrentPosts(getSearchResult().slice(indexOfFirstPost, indexOfLastPost));
    }, [page, search, products])

    const handleChangePage = (page) => {
        const newUrl = `/shop/${categoryid}/1/${page}`;
        navigate(newUrl);
        setCurrentPage(page)
    }

    const onChangeSearch = (e) => {
        setSearch(e.target.value);
    }

    const getSearchResult = () => {
        return search === "" ? products : products.filter((it) => it.name.toLowerCase().includes(search.toLowerCase()));
    }

    const goLatest = () => {
        navigate(`/shop/${categoryid}/1/1`)
    }

    return (
        <div>
            <div>
                <p>{title[categoryid-1]}</p>
            </div>
            <div>
                <div>
                    <ul>
                        <li>총 <span>{count}</span>개의 상품이 있습니다.</li>
                    </ul>
                </div>
                <ul>
                    <li onClick={goLatest}><strong>카테고리</strong></li>
                </ul>
            </div>
            <div>
                <input value={search} onChange={onChangeSearch} placeholder="검색어를 입력하세요" />
            </div>
            <div>
                {currentPosts && currentPosts.map((product) => (
                    <div key={product.id}>
                        <ul>
                            <div>
                                <Link to={`/product/${product.id}`} >
                                    <img src={product.thumbnail} alt="이미지"/>
                                </Link>
                            </div>
                            <li>{product.name}</li>
                            <li>{product.price.toLocaleString()}원</li>
                        </ul>
                    </div>
                ))}
            </div>

            <Paging page={page} count={count} handleChangePage={handleChangePage} postPerPage={postPerPage} />
        </div>
    )
}

export default Latestlist;
