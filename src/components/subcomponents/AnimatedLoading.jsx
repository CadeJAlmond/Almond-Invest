/** AnimatedLoading.jsx
 * @param { object } styles :  
 * @returns An animated screen intended to indicate "loading" data on 
 *      behalf of a component
 */

/* --=== Imports ===-- */
import svg from "../../../public/logoipsum-280.svg"

export default function AnimatedLoading({styles}) {
    return (
        <div className={ styles + " animate-pulse duration-700 absolute"} >
            <h3 className="text-[32px] text-[#9ca3af] no-wrap" >Loading new data...</h3>
            <img src={svg} className="w-[100px]"/>
        </div>
    )
}