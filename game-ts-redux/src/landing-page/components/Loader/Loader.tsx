import { useAppSelector } from "../../../hooks"
import './Loader.css'
let loadingState = false;
export function Loader() {
    const gameLoading = useAppSelector((state) => state.websiteStateStore.gameLoading)


    if (gameLoading) {
        loadingState = true;
    }

    if (!gameLoading && loadingState) {
        const ring_element = document.getElementById("ring-wrapper-id");
        // const ring = document.getElementById("ring-id");
        setTimeout(() => {
            loadingState = false
        }, 4000)
        if (ring_element
            // && ring_element.parentNode
            // && ring
        ) {
            ring_element.style.animation = "fade-out 3s forwards";
            // console.log("ring---", ring_element)
            // console.log("fading out ..")
            setTimeout(() => {
                try {
                    // console.log("ring---removing ring wrapper")
                    // ring_element.parentNode!.removeChild(ring_element)
                    // ring_element.remove()
                    document.removeChild(ring_element)
                } catch (err) {
                    // console.log("ring---unable to delete ring ", err)
                }
            }, 3000)

        }
    }

    return (
        <>
            {
                loadingState &&
                <div className="ring-wrapper" id="ring-wrapper-id">
                    <div className="ring" id="ring-id" style={{textAlign: "center"}}>
                        Loading
                        {/* <span className="ring-span"></span> */}
                    </div>
                </div>
            }
        </>

    )
}