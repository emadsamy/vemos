import React, {useEffect, useState} from 'react';
import {Route, Switch, NavLink} from 'react-router-dom';
import axios from 'axios';
import classes from './Header.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';


const Header = (props) => {
    // const [count, setCount] = useState(0);
    // const [products, setProducts] = useState([]);
    // useEffect(() => {
    //     console.log('Count is: ', count);
    // }, [count]);

    // useEffect(() => {
    //     fetchProducts();
    // }, []);

    // const fetchProducts = () => {
    //     axios.get(window.baseURL + "/products")
    //     .then((res) => {
    //         // console.log(res.data.data);
    //         setProducts(res.data.data);
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
    // }

    // // const handleClick = () => {
    // //     setCount(count + 1);
    // // }
    return (
        <div className={classes.homeContainer}>
            <Swiper
            spaceBetween={20}
            slidesPerView={1}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}>
                <SwiperSlide>Slide 1</SwiperSlide>
                <SwiperSlide>Slide 2</SwiperSlide>
                <SwiperSlide>Slide 3</SwiperSlide>
                <SwiperSlide>Slide 4</SwiperSlide>
            </Swiper>
        </div>
    );
}

export { Header };