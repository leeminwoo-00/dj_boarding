document.addEventListener('DOMContentLoaded', function(){    
    // input keydown
    const inputBox = document.querySelectorAll('.destination_input');
    inputBox.forEach((val) => {
        val.addEventListener('keyup', (e) => {
            const target = e.currentTarget;
            const targetVal = target.value.length;
            const targetSibling = e.currentTarget.nextElementSibling;
            
            if(targetVal >= 0){
                targetSibling.style.display = 'block'
            }
        })
    })
    // 아코디언 토글
    const accordionBtn = document.querySelectorAll('.accordion_btn');
    accordionBtn.forEach((btn) => {
        btn.addEventListener("click", (e)=> {
            const target = e.currentTarget;
            const parent = target.parentNode;
            parent.classList.toggle('on')
            target.setAttribute(
                'aria-expanded', 
                target.getAttribute('aria-expanded') === 'true' 
                    ? 'false' 
                    : 'true'
            );
        });
    });
    // 사이드 메뉴 토글
    const sideMenu = document.querySelector('.side_menu');
    document.querySelector('#rightMenu').addEventListener('click',sideMenuFunc, false)
    function sideMenuFunc(){
        sideMenu.classList.toggle('on');
        document.querySelector('body').classList.toggle('on');
        sideMenu.setAttribute(
            'aria-expanded', 
            sideMenu.getAttribute('aria-expanded') === 'true' 
                ? 'false' 
                : 'true'
        );
    }
    // 즐겨찾기 버튼 토글
    const btnbookmark = document.querySelectorAll('.btn_bookmark');
    btnbookmark.forEach((btn) => {
        btn.addEventListener('click', (e)=> {
            e.currentTarget.classList.toggle('on')
        })
    })
})

// 탭메뉴
function tabsInit(){
    // 탭메뉴 이벤트
    const tabs = document.querySelectorAll(".tab_btn");
    const tabList = document.querySelector(".tab_btn_list");

    // Add a click event handler to each tab
    tabs.forEach((tab) => {
        tab.addEventListener("click", changeTabs);
    });

    // Enable arrow navigation between tabs in the tab list
    let tabFocus = 0;

    tabList.addEventListener("keydown", (e) => {
        // Move right
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            tabs[tabFocus].setAttribute("tabindex", -1);
            if (e.key === "ArrowRight") {
                tabFocus++;
                // If we're at the end, go to the start
                if (tabFocus >= tabs.length) {
                    tabFocus = 0;
                }
                // Move left
            } else if (e.key === "ArrowLeft") {
                tabFocus--;
                // If we're at the start, move to the end
                if (tabFocus < 0) {
                    tabFocus = tabs.length - 1;
                }
            }

            tabs[tabFocus].setAttribute("tabindex", 0);
            tabs[tabFocus].focus();
        }
    });
    function changeTabs(e) {
        const target = e.currentTarget;
        const parent = target.parentNode;
        const grandparent = parent.parentNode;
    
        // Remove all current selected tabs
        parent
            .querySelectorAll('[aria-selected="true"]')
            .forEach((t) => t.setAttribute('aria-selected', false));
    
        // Set this tab as selected
        target.setAttribute('aria-selected', true);
    
        // Hide all tab panels
        grandparent
            .querySelectorAll('[role="tabpanel"]')
            .forEach((p) => p.setAttribute('hidden', true));
    
        // Show the selected panel
        grandparent.parentNode
            .querySelector(`#${target.getAttribute('aria-controls')}`)
            .removeAttribute('hidden');
    }
}
// overlayscroll 기본 옵션
const defaultOptions = {
    paddingAbsolute: false,
    showNativeOverlaidScrollbars: false,       
    overflow: {
        x: "hidden",
        y: "scroll"
    },
    scrollbars: {
        theme: "os-theme-dark",
        visibility: "auto",
        autoHide: "never",
        autoHideDelay: 600,
        dragScroll: true,
        clickScroll: false,
        pointers: ["mouse", "touch", "pen"]
    }
}
// 일반 초기화
function osDefault(selector, scroll){    
    // overlayscroll 변수
    const { 
        OverlayScrollbars, 
        ScrollbarsHidingPlugin, 
        SizeObserverPlugin, 
        ClickScrollPlugin  
    } = OverlayScrollbarsGlobal;

    const osInstance = OverlayScrollbars(document.querySelector(selector), {}, {
    });
    osInstance.options(defaultOptions);

    // viewport scroll position
    const { viewport } = osInstance.elements();
    const { scrollLeft, scrollTop } = viewport; // get scroll offset
    viewport.scrollTo({ top: scroll }); // set scroll offset
}
// input 클릭할 때 초기화
function overlayAction (){        
    // overlayscroll 변수
    const { 
        OverlayScrollbars, 
        ScrollbarsHidingPlugin, 
        SizeObserverPlugin, 
        ClickScrollPlugin  
    } = OverlayScrollbarsGlobal;

    // 출발-도착지 콤보박스
    const startingDestination = document.querySelectorAll('.destination_input')
    const keywordBox = document.querySelectorAll('.keyword_place_box')
    startingDestination.forEach((input) => {        
        input.addEventListener('keydown', selectBoxInit, false);
        input.addEventListener('focus', (e)=> {
            let target = e.currentTarget;
            focusScrolling(target)
        });
    });
    // 인풋박스 바깥 영역 클릭시 숨김
    document.body.addEventListener('click', function (e){
        keywordBox.forEach((e) => {
            e.style.display = 'none'
        })
    })

    // 셀렉트박스 작동
    function selectBoxInit(e){
        let target = e.currentTarget,
            targetID = target.getAttribute('id'),
            targetDescendant = document.querySelector('[aria-label=' + targetID + ']');

        keywordBox.forEach((e) => {
            e.style.display = 'none'
        })
        targetDescendant.style.display = 'flex'
        // 클릭시 스크롤바 생성
        osInit(targetID);
        
        e.stopPropagation();
    }

    // 초기화, 뷰포트 영역, 초기 스크롤 위치
    function osInit(targetID){
        const osInstance = OverlayScrollbars(document.querySelector('#' + targetID + '_id'), {}, {
        });
        osInstance.options(defaultOptions);

        // viewport scroll position
        const { viewport } = osInstance.elements();
        const { scrollLeft, scrollTop } = viewport; // get scroll offset
        viewport.scrollTo({ top: 0 }); // set scroll offset
    }

    // 모바일 focus 상태 태그위치 스크롤
    function focusScrolling(target){
        // input 세로높이 + label 세로높이
        let targetHeight = target.offsetHeight + 20;
        let topPos = target.getBoundingClientRect().top;
        window.scrollTo({
            top: (window.pageYOffset + topPos) - targetHeight,
            behavior: 'smooth'
        })
    }
}
