import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Write = () => {
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [publishing, setPublishing] = useState(false);

    // Edit Mode State
    const [searchParams] = useSearchParams();
    const editSlug = searchParams.get('edit');
    const isEditMode = !!editSlug;

    const navigate = useNavigate();
    const { user } = useAuth();

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Tell your story...',
            }),
        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'prose prose-lg focus:outline-none min-h-[300px]',
            },
        },
    });

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/v1/categories/`)
            .then(res => setCategories(res.data.results || res.data))
            .catch(err => console.error("Failed to fetch categories", err));

        if (isEditMode) {
            axios.get(`${API_BASE_URL}/api/v1/${editSlug}/`)
                .then(res => {
                    const post = res.data;
                    setTitle(post.title);
                    setSlug(post.slug);
                    setSelectedCategory(post.categories[0]?.id || '');
                    if (editor) {
                        editor.commands.setContent(post.body);
                    }
                })
                .catch(err => console.error("Failed to fetch post for editing", err));
        }
    }, [isEditMode, editSlug, editor]);

    const handlePublish = async () => {
        if (!user) {
            alert('You must be logged in to publish.');
            navigate('/login');
            return;
        }

        if (!title.trim()) {
            alert('Please enter a title');
            return;
        }

        setPublishing(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('body', editor.getText());

        formData.append('slug', slug || '');
        if (selectedCategory) formData.append('category_ids', selectedCategory);

        if (coverImage) {
            formData.append('image', coverImage);
        }

        try {
            let response;
            if (isEditMode) {
                response = await axios.patch(`${API_BASE_URL}/api/v1/${editSlug}/`, formData);
            } else {
                response = await axios.post(`${API_BASE_URL}/api/v1/`, formData);
            }
            navigate(`/posts/${response.data.slug || editSlug}`); // Redirect to post
        } catch (error) {
            console.error('Error publishing:', error.response || error);
            const errorData = error.response?.data || {};
            const errorMessage = errorData.detail || JSON.stringify(errorData);
            alert(`Failed to publish: ${errorMessage}`);
        } finally {
            setPublishing(false);
        }
    };

    return (
        <div className="container" style={{ marginTop: '60px', maxWidth: '800px' }}>
            <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <button
                    onClick={handlePublish}
                    disabled={publishing}
                    style={{
                        backgroundColor: '#5d7fb9',
                        color: 'white',
                        padding: '10px 24px',
                        borderRadius: '20px',
                        border: 'none',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: publishing ? 'not-allowed' : 'pointer',
                        opacity: publishing ? 0.7 : 1
                    }}
                >
                    {publishing ? (isEditMode ? 'Updating...' : 'Publishing...') : (isEditMode ? 'Update' : 'Publish')}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#718096', fontSize: '0.9rem' }}>Cover Image</label>
                    <label
                        htmlFor="cover-image"
                        style={{
                            display: 'inline-block',
                            padding: '8px 16px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            width: '100%',
                            textAlign: 'center',
                            color: '#4a5568'
                        }}
                    >
                        {coverImage ? coverImage.name : (isEditMode ? 'Change Cover Image' : 'Upload Cover Image')}
                    </label>
                    <input
                        type="file"
                        id="cover-image"
                        style={{ display: 'none' }}
                        onChange={(e) => setCoverImage(e.target.files[0])}
                        accept="image/*"
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#718096', fontSize: '0.9rem' }}>Category</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: 'white'
                        }}
                    >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Custom URL Slug (Optional)"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '0.9rem',
                        border: 'none',
                        borderBottom: '1px solid #e2e8f0',
                        outline: 'none',
                        color: '#718096'
                    }}
                />
            </div>

            <input
                dir="auto"
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                    width: '100%',
                    fontSize: '3rem',
                    fontWeight: '700',
                    fontFamily: 'var(--font-heading), var(--font-farsi)',
                    border: 'none',
                    outline: 'none',
                    marginBottom: '20px',
                    backgroundColor: 'transparent'
                }}
            />

            <div className="editor-wrapper" dir="auto" style={{ fontSize: '1.25rem', fontFamily: 'var(--font-main), var(--font-farsi)' }}>
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};

export default Write;
