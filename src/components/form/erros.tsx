interface ErrorMessage {
  [key: string]: string[]; // Objeto con claves y arrays de strings
}

interface SubmitErrorProps {
  errorMessage: string[] | ErrorMessage | null;
}

const SubmitError: React.FC<SubmitErrorProps> = ({ errorMessage }) => {
  if (!errorMessage) return null;

  return (
    <>
      {errorMessage && (
        <ul className="text-red-500 px-5 my-3">
          {Array.isArray(errorMessage)
            ? errorMessage.map((val, index) => (
                <li className="list-disc" key={index}>
                  {val}
                </li>
              ))
            : Object.entries(errorMessage).map(([key, values]) =>
                values.map((val, index) => (
                  <li className="list-disc" key={`${key}-${index}`}>
                    {val}
                  </li>
                ))
              )}
        </ul>
      )}
    </>
  );
};

export default SubmitError;
