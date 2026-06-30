package DACNTT.garage.handle;

import DACNTT.garage.dto.BranchDTO;
import DACNTT.garage.dto.BranchPageDTO;
import DACNTT.garage.mapper.BranchMapper;
import DACNTT.garage.model.Branch;
import DACNTT.garage.service.BranchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

@Component
public class BranchCacheService {

    @Autowired
    private BranchService branchService;

    @Autowired
    private BranchMapper branchMapper;

    @Cacheable(
            value = "branchDtos",
            key = "'list:' + #page + ':' + #size + ':' + T(java.util.Objects).toString(#ten) + '|' + T(java.util.Objects).toString(#diaChi) + '|' + T(java.util.Objects).toString(#sdt) + '|' + T(java.util.Objects).toString(#email)"
    )
    public BranchPageDTO getAllBranches(int page, int size,
                                        String ten, String diaChi, String sdt, String email) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("maChiNhanh"));
        var result = branchService.searchBranches(ten, diaChi, sdt, email, pageable);
        return BranchPageDTO.builder()
                .content(result.map(branchMapper::toBranchDTO).getContent())
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build();
    }

    @Cacheable(value = "branchDtos", key = "'id:' + #maChiNhanh")
    public BranchDTO getBranchById(String maChiNhanh) {
        Branch branch = branchService.getById(maChiNhanh);
        return branchMapper.toBranchDTO(branch);
    }

    @CacheEvict(value = "branchDtos", allEntries = true)
    public void evictBranches() {
    }
}
