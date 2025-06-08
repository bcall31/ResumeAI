

const Input_Input = (props) => {
    const handleChange = (event) => {
        const value = event.target.value
        // console.log(value)
    }
    
    return (
        <>
            <input type="text" className="form-control" onChange={handleChange} id={props.id}/>
        </>
    )
}

export default Input_Input