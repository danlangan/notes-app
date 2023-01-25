import { useMemo, useState } from "react"
import { Row, Col, Stack, Button, FormGroup, FormLabel, FormControl, Form, Card, Badge } from "react-bootstrap"
import { Link } from "react-router-dom"
import ReactSelect from "react-select"
import { Tag } from "./App"
import styles from './NoteListModule.css'

type NoteListProps = {
    availableTags: Tag[]
    notes: SimplifiedNote[]
}

type SimplifiedNote = {
    tags: Tag[]
    title: string
    id: string
}

export function NoteList({ availableTags, notes }: NoteListProps) {

    const [selectedTags, setSelectedTags] = useState<Tag[]>
    ([])
    const [title, setTitle] = useState('')

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
                    <Button variant='outline-secondary'>Edit Tags</Button>
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
        </>
    )
}

function NoteCard({id, title, tags}: SimplifiedNote) {
 return <Card as={Link} to={`${id}`} className={`h-100 text-reset text-decoration-none ${styles.card}`}>
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