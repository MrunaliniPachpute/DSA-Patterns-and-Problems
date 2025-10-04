const scrollToTopBtn = document.querySelector(".back-to-top-btn");
const scrollToPrevTopicBtn = document.querySelector(".back-to-prev-topic-btn");

function scrollToTop(){
    window.scrollTo({top: 0, behavior: "smooth"});
}

function showScrollToTop(){
    const scrollDistance = window.scrollY;
    if(scrollDistance > 100){
        scrollToTopBtn.classList.remove("hidden");
    }
    else{
        scrollToTopBtn.classList.add("hidden");
    }
}

function scrollToPrevTopic(){
    window.history.back();
}

scrollToTopBtn.addEventListener("click",() => scrollToTop());

window.addEventListener("scroll",() => showScrollToTop());

scrollToPrevTopicBtn.addEventListener("click",() => scrollToPrevTopic());