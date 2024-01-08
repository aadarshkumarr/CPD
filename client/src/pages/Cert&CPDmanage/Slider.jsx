import React from 'react'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Card from './Card';


const SampleNext = (props) => {
  const { onClick } = props
  return (
    <div className='ctrl-btn' >
      <button className='next' onClick={onClick}>
        <ArrowForwardIosIcon className='next-icon' style={{ fontSize: "30px", color: "#941414" }} />
      </button>
    </div>
  )
}
const SamplePrev = (props) => {
  const { onClick } = props
  return (
    <div className='ctrl-btn' >
      <button className='prev' onClick={onClick}>
        <ArrowBackIosNewIcon className='prev-icon' style={{ fontSize: "30px", color: "#941414" }} />
      </button>
    </div>
  )
}

const SliderHome = ({ course }) => {
  const settings = {
    dots : true,
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "-10px",
    slidesToShow: 2,
    speed: 500,
    nextArrow: <SampleNext />,
    prevArrow: <SamplePrev />,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]

  };

  const test = () => {
    console.log(course);
  }
  return (
    <div className="homeContainer">
      <Slider {...settings}>
        {course.map(ele => (
          <Card key={ele._id} course={ele} />
        ))

        }
      </Slider>
    </div>
  )
}

export default SliderHome