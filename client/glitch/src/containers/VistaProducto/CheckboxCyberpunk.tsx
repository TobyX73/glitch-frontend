import styled from 'styled-components';

interface CheckboxCyberpunkProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const CheckboxCyberpunk = ({ label, checked, onChange }: CheckboxCyberpunkProps) => {
  return (
    <StyledWrapper>
      <label className="cyberpunk-checkbox-label">
        <input 
          type="checkbox" 
          className="cyberpunk-checkbox" 
          checked={checked}
          onChange={onChange}
        />
        {label}
      </label>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .cyberpunk-checkbox {
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid #0df39c;
    border-radius: 5px;
    background-color: transparent;
    display: inline-block;
    position: relative;
    margin-right: 10px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
  }

  .cyberpunk-checkbox:hover {
    border-color: #0df39c;
    box-shadow: 0 0 8px rgba(13, 243, 156, 0.4);
  }

  .cyberpunk-checkbox:before {
    content: "";
    background-color: #0df39c;
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    width: 10px;
    height: 10px;
    border-radius: 3px;
    transition: all 0.3s ease-in-out;
  }

  .cyberpunk-checkbox:checked:before {
    transform: translate(-50%, -50%) scale(1);
  }

  .cyberpunk-checkbox-label {
    font-size: 16px;
    color: #fff;
    cursor: pointer;
    user-select: none;
    display: flex;
    align-items: center;
  }
`;

export default CheckboxCyberpunk;
