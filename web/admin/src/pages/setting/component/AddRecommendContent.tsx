import { getNodeList, ITreeItem, NodeListFilterData } from "@/api"
import Nodata from '@/assets/images/nodata.png'
import DragTree from "@/components/Drag/DragTree"
import { convertToTree } from "@/constant/drag"
import { useAppSelector } from "@/store"
import { Box, Skeleton, Stack } from "@mui/material"
import { Modal } from "ct-mui"
import { useCallback, useEffect, useState } from "react"

interface AddRecommendContentProps {
  open: boolean
  selected: string[]
  onChange: (value: string[]) => void
  onClose: () => void
}

const AddRecommendContent = ({ open, selected, onChange, onClose }: AddRecommendContentProps) => {
  const [list, setList] = useState<ITreeItem[]>([])
  const [loading, setLoading] = useState(false)
  const { kb_id } = useAppSelector(state => state.config)
  const [selectedIds, setSelectedIds] = useState<string[]>(selected)

  const getData = useCallback(() => {
    setLoading(true)
    const params: NodeListFilterData = { kb_id }
    getNodeList(params).then(res => {
      const v = convertToTree(res || [])
      setList(v)
    }).finally(() => {
      setLoading(false)
    })
  }, [kb_id])

  const onSelectChange = useCallback((id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }, [selectedIds])

  useEffect(() => {
    setSelectedIds(selected)
  }, [selected])

  useEffect(() => {
    if (open && kb_id) getData()
  }, [open, kb_id, getData])

  return <Modal
    title="添加卡片"
    width={800}
    open={open}
    onOk={() => {
      onChange(selectedIds)
      onClose()
    }}
    onCancel={onClose}
  >
    {loading ? <Stack gap={2}>
      {new Array(10).fill(0).map((_, index) => <Skeleton variant='text' height={20} key={index} />)}
    </Stack> : list.length > 0 ? <DragTree
      type='select'
      selected={selectedIds}
      data={list}
      refresh={getData}
      batchOpen={true}
      onSelectChange={onSelectChange}
    /> : <Stack alignItems={'center'} justifyContent={'center'}>
      <img src={Nodata} alt="empty" style={{ width: 100, height: 100 }} />
      <Box sx={{ fontSize: 12, lineHeight: '20px', color: 'text.auxiliary', mt: 1 }}>
        暂无数据，前往文档页面创建文档
      </Box>
    </Stack>}
  </Modal>
}

export default AddRecommendContent