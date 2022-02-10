import React, { useState, useEffect } from 'react';
import FileBase from 'react-file-base64';

import { useDispatch, useSelector } from 'react-redux';
import { ButtonGroup, TextField } from '@material-ui/core';
import { PostAdd, Photo, Link, List } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { getTags } from '../../actions/Tag';
import { createPost } from '../../actions/post';
import { useNavigate } from 'react-router-dom';
import './Styles.css';
import useStyles from './Styles';

const Form = () => {
    const [activebutton, setactiveButton] = useState('Post');
    const user = JSON.parse(localStorage.getItem('profile'));
    const dispatch = useDispatch();
    const classes = useStyles();
    const navigate = useNavigate();
    const tags = useSelector((state) => state.tags);
    const [postData, setPostData] = useState({title: '', LocImage: '', tags_name: '', tags_type: '', creator: '', creatorEmail: '', post_Type: activebutton, post_Texts: '' })

    useEffect(() => {
        dispatch(getTags());
    }, [dispatch]);
    
    const clear = () => {
        setPostData({title: '', LocImage: '', tags_name: '', tags_type: '', creator: '', creatorEmail: '', post_Type: activebutton, post_Texts: '' });
    }

    const handleSubmit = (e) =>  {
        e.preventDefault();

        dispatch(createPost({...postData, creator: user?.result?.name, creatorEmail: user?.result?.email, post_Type: activebutton}, navigate));
        clear();
    }

    const handleChange = (e) => {
        setPostData({ ...postData, [e.target.name]: e.target.value});
    }

    return (
        <div className='createForm'>
            <form autoComplete='off' onSubmit={handleSubmit}>
                <div className='CreatePostTop'>
                    <label>Create a Post</label>
                </div>
                <hr style={{ width: '100%', height: '1px', color: 'Black' }} />
                <div className='chooseTag'>
                    <Autocomplete
                        id="Tags"
                        className={classes.Autocomplete}
                        classes={classes}
                        options={tags}
                        onSelect={(e) => setPostData({...postData, tags_name: e.target.value})}
                        renderInput={params => (
                            <TextField required className={classes.textfield}  {...params} label="Post Type" variant="outlined" />
                        )}
                        onChange={(e) => setPostData({...postData, tagname: e.target.value})}
                        getOptionLabel={option => option.name}
                        style={{ width: '130px', border: '1px solid #fff2', background: '#1A1A1B', borderRadius: '5px' }}
                    />
                    <Autocomplete
                        id="Tags"
                        options={tags}
                        autoHighlight
                        onSelect={(e) => setPostData({...postData, tags_type: e.target.value})}
                        className={classes.Autocomplete}
                        renderInput={params => (
                            <TextField required className={classes.textfield} style={{fontSize: '10px'}} {...params} label="Tag Name"  variant="outlined" />
                        )}
                        style={{ width: 270, border: '1px solid #fff2', background: '#1A1A1B', borderRadius: '5px' }}
                        getOptionLabel={option => option.tagtype}
                    />
                </div>
                <div className='cP'>
                    <ButtonGroup style={{ width: '100%' }} className='ButtonGroup'>
                        <button type='button' className={activebutton === 'Post' ? 'focusClass' : ''} onClick={() => setactiveButton('Post')}><PostAdd />Post</button>
                        <button type='button' className={activebutton === 'Images' ? 'focusClass' : ''} onClick={() => setactiveButton('Images')}><Photo />Image and Video</button>
                        <button type='button' className={activebutton === 'Link' ? 'focusClass' : ''} onClick={() => setactiveButton('Link')}><Link />Link</button>
                        <button type='button' className={activebutton === 'Poll' ? 'focusClass' : ''} onClick={() => setactiveButton('Poll')}><List />Poll</button>
                    </ButtonGroup>
                    <div className='Postdata'>
                        <div>
                            {activebutton === 'Post' ? (
                                <>
                                    <input type='text' required placeholder='Enter Title' onChange={handleChange}  />
                                    <div className='editablediv'>
                                        <div contentEditable ></div>
                                    </div>
                                </>
                            ) : activebutton === 'Images' ? (
                                <>
                                    <input name='title' type='text' required placeholder='Enter Title' onChange={handleChange} />
                                    <FileBase name='LocImage' type='file' multiple={false} onDone={({base64}) => setPostData({ ...postData, LocImage: base64 })}  />
                                </>
                            ) : activebutton === 'Link' ? (
                                <label>Link</label>
                            ) : (
                                <label>Poll</label>
                            )}
                            <hr style={{ width: '100%', opacity: '.3' }} />
                            <div className='postDatabuttons'>
                                <button type='button'>Cancel</button>
                                <button type='Submit'>Create</button>
                            </div>
                        </div>
                    </div>
                </div>

            </form>
            <div className='Rules'>
                <div style={{background: 'var(--color-white)'}} className='Instr'>
                    <ul>
                        <lh>Posting to Reddit</lh>
                        <hr style={{ background: 'black', width: '80%', height: '1px' }} />
                        <li>Posting to Reddit</li>
                        <hr style={{ background: 'black', width: '80%', height: '1px' }} />
                        <li>Posting to Reddit</li>
                        <hr style={{ background: 'black', width: '80%', height: '1px' }} />
                        <li>Posting to Reddit</li>
                        <hr style={{ background: 'black', width: '80%', height: '1px' }} />
                        <li>Posting to Reddit</li>
                        <hr style={{ background: 'black', width: '80%', height: '1px' }} />
                        <li>Posting to Reddit</li>
                    </ul>
                </div>
                <div className='Instr'>
                    
                </div>
            </div>
        </div>
    )
}

export default Form
