


const Error_Tag = ({ error }) => {
    return (
        <>
            {!error ? null : (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
        </>
    );
}

export default Error_Tag