package DACNTT.garage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class BranchPageDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private List<BranchDTO> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
}
