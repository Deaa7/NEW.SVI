export default function LoadingPage()
{
    let rootStyle = {
        height: '800px',
        backgroundColor:'#111111'
    }
    let parag = {
        fontSize: '50px',
        textAlign: 'center',
        paddingTop: '12%',
        color:'white',
    }
    let sz = {
        width: '100px',
        height:'100px',
    }

    return <>
        <div style={rootStyle}>
            
            <p style ={parag}>
                <div id="spinner" ></div> &nbsp;&nbsp;
                ...
                جاري تحميل الصفحة 
            </p>
     </div>
    </>
}
