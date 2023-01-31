import { useState } from "react";
import { Formik, Form, Field, ErrorMessage as ErrorMessageFormik} from 'formik';
import * as Yup from 'yup'
import { Link } from "react-router-dom";

import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";

import './charSearchForm.scss';

const CharSearchForm = () => {
    const [chars, setChars] = useState(null);
    const {getCharactersByName, clearError, process, setProcess} = useMarvelService();

    const onCharLoaded = (chars) => {
        setChars(chars);
    }

    const updateChar = (name) => {
        clearError();

        getCharactersByName(name)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'));
    }

    const errorMessage = process === 'error' ? <div className="char__search-critical-error"><ErrorMessage /></div> : null;
    const results = !chars ? null : chars.length > 0 ?
                    <ul className="char__comics-list">
                        {
                            chars.map((item, i) => {
                                if (i > 10) return;
                                return (
                                    <li key={i} className="char__comics-item">
                                        <Link to={`/characters/${item.id}`} >
                                            {item.name}
                                        </Link>
                                    </li>
                                )
                            })
                        }
                    </ul> 
                    : 
                    <div className="char__search-error">
                        The character was not found. Check the name and try again
                    </div>;

    return (
        <div className="char__search-form">
            <Formik
                initialValues = {{
                    charName: ''
                }}
                validationSchema = {Yup.object({
                    charName: Yup.string().required('This field is required')
                })}
                onSubmit = { ({charName}) => {
                    updateChar(charName);
                }}
            >
                <Form>
                    <label className="char__search-label" htmlFor="charName">Or find a character by name:</label>
                    <div className="char__search-wrapper">
                        <Field 
                            id="charName" 
                            name='charName' 
                            type='text' 
                            placeholder="Enter name"/>
                        <button 
                            type='submit' 
                            className="button button__main"
                            disabled={process === 'loading'}>
                            <div className="inner">find</div>
                        </button>
                    </div>
                    <ErrorMessageFormik component="div" className="char__search-error" name="charName" />
                </Form>
            </Formik>
            {results}
            {errorMessage}
        </div>
    )
}

export default CharSearchForm;