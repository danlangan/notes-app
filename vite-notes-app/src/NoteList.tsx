import { useMemo, useState } from "react"
import { Row, Col, Stack, Button, FormGroup, FormLabel, FormControl, Form, Card, Badge, Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap"
import { Link } from "react-router-dom"
import ReactSelect from "react-select"
import { Tag } from "./App"
import styles from './NoteListModule.css'

type NoteListProps = {
    availableTags: Tag[]
    notes: SimplifiedNote[]
    onDeleteTag: (id: string, label: string) => void
    onUpdateTag: (id: string, label: string) => void
}

type SimplifiedNote = {
    tags: Tag[]
    title: string
    id: string
}

type EditTagsModalProps = {
    show: boolean
    availableTags: Tag[]
    handleClose: () => void
    onDeleteTag: (id: string) => void
    onUpdateTag: (id: string, label: string) => void
}

export function NoteList({ availableTags, notes, onUpdateTag, onDeleteTag }: NoteListProps) {

    const [selectedTags, setSelectedTags] = useState<Tag[]>
    ([])
    const [title, setTitle] = useState('')
    const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false)

    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            return (title === '' || note.title.toLowerCase().includes(title.toLocaleLowerCase())) && 
            (selectedTags.length === 0 || selectedTags.every(tag => note.tags.some(noteTag => noteTag.id === tag.id)))
        })
    }, [title, selectedTags, notes] )

    return (
        <>
        <Row className="align-items-center mb-4">
            <Col><h1>Notes</h1></Col>
            <Col xs='auto'>
                <Stack gap={2} direction='horizontal'>
                    <Link to='/new'>
                        <Button variant='primary'>Create</Button>
                    </Link>
                    <Button variant='outline-secondary' onClick={() => setEditTagsModalIsOpen(true)}>Edit Tags</Button>
                </Stack>
            </Col>
        </Row>
        <Form>
            <Row className="mb-4">
                <Col>
                <FormGroup controlId="title">
                    <FormLabel>Title</FormLabel>
                        <FormControl type='text' value='title' onChange={e => setTitle(e.target.value)}/>
                </FormGroup>
                </Col>
                <Col>
                <FormGroup controlId='tags'>
                    <FormLabel>Tags</FormLabel>
                    <ReactSelect 
                        value={selectedTags.map(tag => {
                        return { label: tag.label, value: tag.id }
                    })}
                    options={availableTags.map(tag => {
                        return { label: tag.label, value: tag.id }
                    })}
                    onChange={tags => {
                        setSelectedTags(tags.map(tag => {
                            return { label: tag.label, id: tag.value }
                        }))
                    }}
                    isMulti/>
                </FormGroup>
                </Col>
            </Row>
        </Form>
        <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
            {filteredNotes.map(note => ( 
                <Col key={note.id}>
                    <NoteCard id={note.id} title={note.title} tags={note.tags} />
                </Col>
            ))}
        </Row>
        <EditTagsModal show={editTagsModalIsOpen} handleClose={() => setEditTagsModalIsOpen(false)} availableTags={availableTags} onUpdateTag={onUpdateTag} onDeleteTag={onDeleteTag}/>
        </>
    )
}

function NoteCard({id, title, tags}: SimplifiedNote) {
 return <Card as={Link} to={`${id}`} className={`h-100 text-reset text-decoration-none`}>
    <Card.Body>
        <Stack gap={2} className='align-items-center justify-content-center h-100'>
            <span className="fs-5">{title}</span>
            {tags.length > 0 && ( 
            <Stack
                gap={1}
                direction='horizontal'
                className="justify-content-center flex-wrap"
                >
                {tags.map(tag => (
                    <Badge className='text-truncate' key={tag.id}>
                        {tag.label}
                    </Badge>
                ))}
                </Stack>
                )}
        </Stack>
    </Card.Body>
 </Card>
}

function EditTagsModal({ 
    availableTags, 
    handleClose, show,
    onUpdateTag,
    onDeleteTag
    }: EditTagsModalProps) {
    return <Modal show={show} onHide={handleClose}>
        <ModalHeader closeButton>
            <ModalTitle>Edit Tags</ModalTitle>
        </ModalHeader>
        <ModalBody>
            <Form>
                <Stack gap={2}>
                    {availableTags.map(tag => (
                        <Row key={tag.id}>
                            <Col> 
                            <FormControl 
                            type='text' 
                            value={tag.label}
                            onChange={e => onUpdateTag(tag.id, e.target.value)}
                            />
                            </Col>
                            <Col xs='auto'>
                                <Button onClick={() => onDeleteTag(tag.id)} variant='outline-danger'>&times;</Button>
                            </Col>
                        </Row>
                    ))}
                </Stack>
            </Form>
        </ModalBody>
    </Modal>
}